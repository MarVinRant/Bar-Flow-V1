import { supabase } from "./supabase";

export type BarFlowEstablishment = {
  id: string;
  group_id: string;
  name: string;
  slug: string;
  segment: string;
  phone: string | null;
  city: string | null;
  public_description: string | null;
  public_theme: string;
};

export type BarFlowItem = {
  id: string;
  establishment_id: string;
  item_type: "recipe" | "product" | "preparation";
  name: string;
  category: string;
  description: string | null;
  payload: Record<string, unknown>;
  status: "active" | "archived";
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BarFlowMenu = {
  id: string;
  establishment_id: string;
  menu_type: "menu" | "catalog";
  name: string;
  status: "draft" | "published" | "archived";
  public_price_visible: boolean;
};

export type BarFlowMasterItem = {
  id: string;
  item_type: BarFlowItem["item_type"];
  name: string;
  category: string;
  description: string | null;
  status: "draft" | "review" | "published" | "archived";
};

export type PublicMenuData = {
  establishment: Pick<BarFlowEstablishment, "id" | "name" | "phone" | "public_description" | "public_theme">;
  items: Array<{
    id: string;
    name: string;
    description: string | null;
    item_type: BarFlowItem["item_type"];
    public_price: number | null;
  }>;
};

function unavailable() {
  return new Error("Supabase não configurado.");
}

export async function getCurrentEstablishment() {
  if (!supabase) return { data: null, error: unavailable() };
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult.user) return { data: null, error: userError ?? new Error("Sessão não encontrada.") };
  const { data, error } = await supabase
    .from("memberships")
    .select("establishment_id, establishments(*)")
    .eq("user_id", userResult.user.id)
    .eq("status", "active")
    .not("establishment_id", "is", null)
    .limit(1)
    .maybeSingle();
  const establishment = Array.isArray(data?.establishments) ? data?.establishments[0] : data?.establishments;
  return { data: (establishment as BarFlowEstablishment | null) ?? null, error };
}

export async function createOnboarding(input: { name: string; city: string; phone: string; segment: string; starterNames?: string[] }) {
  if (!supabase) return { data: null, error: unavailable() };
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError || !userResult.user) return { data: null, error: userError ?? new Error("Sessão não encontrada.") };
  const existing = await getCurrentEstablishment();
  if (existing.data) return { data: existing.data, error: null };
  const ownedGroup = await supabase.from("business_groups").select("id").eq("owner_id", userResult.user.id).order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (ownedGroup.error) return { data: null, error: ownedGroup.error };
  if (ownedGroup.data) {
    const ownedEstablishment = await supabase.from("establishments").select("*").eq("group_id", ownedGroup.data.id).is("deleted_at", null).order("created_at", { ascending: true }).limit(1).maybeSingle();
    if (ownedEstablishment.error) return { data: null, error: ownedEstablishment.error };
    if (ownedEstablishment.data) {
      const membership = await supabase.from("memberships").upsert({ user_id: userResult.user.id, group_id: ownedGroup.data.id, establishment_id: ownedEstablishment.data.id, role: "owner", status: "active" }, { onConflict: "user_id,group_id,establishment_id" });
      if (membership.error) return { data: null, error: membership.error };
      return { data: ownedEstablishment.data as BarFlowEstablishment, error: null };
    }
  }
  const slugBase = input.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = `${slugBase || "estabelecimento"}-${userResult.user.id.slice(0, 6)}`;
  const group = await supabase.from("business_groups").insert({ name: input.name, owner_id: userResult.user.id }).select("id").single();
  if (group.error || !group.data) return { data: null, error: group.error ?? new Error("Não foi possível criar o grupo.") };
  const establishment = await supabase.from("establishments").insert({ group_id: group.data.id, name: input.name, slug, segment: input.segment, city: input.city, phone: input.phone }).select("*").single();
  if (establishment.error || !establishment.data) return { data: null, error: establishment.error ?? new Error("Não foi possível criar o estabelecimento.") };
  const membership = await supabase.from("memberships").insert({ user_id: userResult.user.id, group_id: group.data.id, establishment_id: establishment.data.id, role: "owner", status: "active" });
  if (membership.error) return { data: null, error: membership.error };
  const menu = await getOrCreateMenu(establishment.data.id);
  if (menu.error) return { data: null, error: menu.error };
  const starterNames = input.starterNames ?? ["Gin Tônica da Casa", "Negroni"];
  if (starterNames.length) {
    const master = await supabase.from("master_items").select("id,item_type,name,category,description,payload").eq("status", "published").in("name", starterNames);
    if (master.error) return { data: null, error: master.error };
    if (master.data?.length) {
      const privateItems = await supabase.from("private_items").insert(master.data.map((item) => ({
        establishment_id: establishment.data.id,
        source_master_id: item.id,
        item_type: item.item_type,
        name: item.name,
        category: item.category,
        description: item.description,
        payload: item.payload ?? {},
        created_by: userResult.user.id,
      }))).select("*");
      if (privateItems.error) return { data: null, error: privateItems.error };
    }
  }
  return { data: establishment.data as BarFlowEstablishment, error: null };
}

export async function fetchPrivateItems(establishmentId: string) {
  if (!supabase) return { data: [] as BarFlowItem[], error: unavailable() };
  return supabase.from("private_items").select("*").eq("establishment_id", establishmentId).is("deleted_at", null).order("created_at", { ascending: false }) as unknown as Promise<{ data: BarFlowItem[] | null; error: Error | null }>;
}

export async function fetchPublishedMasterItems() {
  if (!supabase) return { data: [] as BarFlowMasterItem[], error: unavailable() };
  return supabase.from("master_items").select("id,item_type,name,category,description,status").eq("status", "published").order("name") as unknown as Promise<{ data: BarFlowMasterItem[] | null; error: Error | null }>;
}

export async function fetchPublishedMenuItemCount(establishmentId: string) {
  if (!supabase) return { data: 0, error: unavailable() };
  const menu = await supabase.from("menus").select("id").eq("establishment_id", establishmentId).eq("menu_type", "menu").eq("status", "published").limit(1).maybeSingle();
  if (menu.error || !menu.data) return { data: 0, error: menu.error ?? null };
  const items = await supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("menu_id", menu.data.id).eq("available", true);
  return { data: items.count ?? 0, error: items.error };
}

export async function fetchPublicMenu(slug: string) {
  if (!supabase) return { data: null as PublicMenuData | null, error: unavailable() };
  const establishmentResult = await supabase
    .from("establishments")
    .select("id,name,phone,public_description,public_theme")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();
  if (establishmentResult.error || !establishmentResult.data) {
    return { data: null, error: establishmentResult.error ?? new Error("Cardápio não encontrado.") };
  }

  const menuResult = await supabase
    .from("menus")
    .select("id")
    .eq("establishment_id", establishmentResult.data.id)
    .eq("menu_type", "menu")
    .eq("status", "published")
    .limit(1)
    .maybeSingle();
  if (menuResult.error) return { data: null, error: menuResult.error };
  if (!menuResult.data) return { data: { establishment: establishmentResult.data, items: [] }, error: null };

  const itemsResult = await supabase
    .from("menu_items")
    .select("id,public_price,sort_order,private_items(id,name,description,item_type)")
    .eq("menu_id", menuResult.data.id)
    .eq("available", true)
    .order("sort_order", { ascending: true });
  if (itemsResult.error) return { data: null, error: itemsResult.error };

  type PublicItemRow = {
    id: string;
    public_price: number | null;
    private_items: { id: string; name: string; description: string | null; item_type: BarFlowItem["item_type"] } | null;
  };
  const items = ((itemsResult.data ?? []) as PublicItemRow[])
    .filter((row) => row.private_items)
    .map((row) => ({
      id: row.id,
      name: row.private_items?.name ?? "",
      description: row.private_items?.description ?? null,
      item_type: row.private_items?.item_type ?? "recipe",
      public_price: row.public_price,
    }));
  return { data: { establishment: establishmentResult.data, items }, error: null };
}

export async function savePrivateItem(input: { id?: string; establishment_id: string; item_type: BarFlowItem["item_type"]; name: string; category: string; description?: string; payload?: Record<string, unknown> }) {
  if (!supabase) return { data: null, error: unavailable() };
  if (input.id) return supabase.from("private_items").update({ name: input.name, category: input.category, description: input.description ?? null, payload: input.payload ?? {} }).eq("id", input.id).select("*").single();
  return supabase.from("private_items").insert({ establishment_id: input.establishment_id, item_type: input.item_type, name: input.name, category: input.category, description: input.description ?? null, payload: input.payload ?? {}, created_by: (await supabase.auth.getUser()).data.user?.id }).select("*").single();
}

export async function archivePrivateItem(id: string) {
  if (!supabase) return { error: unavailable() };
  return supabase.from("private_items").update({ deleted_at: new Date().toISOString(), status: "archived" }).eq("id", id);
}

export async function saveEstablishment(id: string, input: { name: string; phone: string; public_description: string }) {
  if (!supabase) return { data: null, error: unavailable() };
  return supabase.from("establishments").update(input).eq("id", id).select("*").single();
}

export async function getOrCreateMenu(establishmentId: string) {
  if (!supabase) return { data: null, error: unavailable() };
  const existing = await supabase.from("menus").select("*").eq("establishment_id", establishmentId).eq("menu_type", "menu").neq("status", "archived").limit(1).maybeSingle();
  if (existing.error || existing.data) return existing;
  return supabase.from("menus").insert({ establishment_id: establishmentId, menu_type: "menu", name: "Cardápio principal" }).select("*").single();
}

export async function publishMenu(menuId: string) {
  if (!supabase) return { data: null, error: unavailable() };
  return supabase.from("menus").update({ status: "published" }).eq("id", menuId).select("*").single();
}

export async function createBillingCheckout(plan: "bronze" | "silver" | "gold", cycle: "monthly" | "annual") {
  if (!supabase) return { data: null, error: unavailable() };
  let session = await supabase.auth.getSession();
  if (!session.data.session) session = await supabase.auth.refreshSession();
  if (session.error || !session.data.session) return { data: null, error: session.error ?? new Error("Sessão não encontrada. Entre novamente para continuar.") };
  const response = await fetch("/api/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.data.session.access_token}` }, body: JSON.stringify({ plan, cycle }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return { data: null, error: new Error(data.detail ? `${data.error ?? "Não foi possível iniciar o checkout."} (${data.detail})` : data.error ?? "Não foi possível iniciar o checkout.") };
  return { data: data as { checkout_url: string; subscription: { id: string; status: string } }, error: null };
}
