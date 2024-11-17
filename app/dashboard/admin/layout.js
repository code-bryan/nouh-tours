import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <>
      <hr />
      <hr />
      <hr />
      <nav>
        <Link href={"/dashboard/admin"}>Admin Dashboard</Link>
        <Link href={"/register"}>New Student</Link>
      </nav>
      {children}
    </>
  );
}
