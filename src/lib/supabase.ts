import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

export const hasSupabaseConfig = Boolean(url && publishableKey);
export const supabase = hasSupabaseConfig ? createClient(url!, publishableKey!) : null;

export type AdminSnapshot = {
  activeCustomers: number;
  establishments: number;
  users: number;
  masterItems: number;
  recentEstablishments: Array<{ id: string; name: string; segment: string; created_at: string }>;
  auditLogs: Array<{ id: string; action: string; entity_type: string; created_at: string }>;
};

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) return { data: null, error: new Error("Supabase não configurado; modo demonstração ativo.") };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: new Error("Supabase não configurado; modo demonstração ativo.") };
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
}

export async function requestPasswordReset(email: string) {
  if (!supabase) return { data: null, error: new Error("Supabase não configurado; modo demonstração ativo.") };
  return supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/recuperar-senha" });
}

export async function fetchAdminSnapshot(): Promise<{ data: AdminSnapshot | null; error: Error | null }> {
  if (!supabase) return { data: null, error: new Error("Supabase não configurado; modo demonstração ativo.") };
  const userResult = await supabase.auth.getUser();
  if (userResult.error || !userResult.data.user) return { data: null, error: userResult.error ?? new Error("Sessão não encontrada.") };

  const [groups, establishments, memberships, masterItems, recent, auditLogs] = await Promise.all([
    supabase.from("business_groups").select("id", { count: "exact", head: true }),
    supabase.from("establishments").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("memberships").select("user_id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("master_items").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("establishments").select("id,name,segment,created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(6),
    supabase.from("audit_logs").select("id,action,entity_type,created_at").order("created_at", { ascending: false }).limit(8),
  ]);
  const failed = [groups, establishments, memberships, masterItems, recent, auditLogs].find((result) => result.error);
  if (failed?.error) return { data: null, error: failed.error };
  return { data: { activeCustomers: groups.count ?? 0, establishments: establishments.count ?? 0, users: memberships.count ?? 0, masterItems: masterItems.count ?? 0, recentEstablishments: recent.data ?? [], auditLogs: auditLogs.data ?? [] }, error: null };
}
