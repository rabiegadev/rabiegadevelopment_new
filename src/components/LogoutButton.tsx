import { logoutAction } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
      >
        Wyloguj
      </button>
    </form>
  );
}
