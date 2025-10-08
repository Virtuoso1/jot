import PaymentConfirm from "./page.client";


export const dynamic = "force-dynamic"; // disable prerender
export const revalidate = 0;            // disable caching

export default function ConfirmPage() {
  return <PaymentConfirm />;
}
