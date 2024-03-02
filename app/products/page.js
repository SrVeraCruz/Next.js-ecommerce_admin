import Link from "next/link";
import Layout from "../../components/Layout";

export default function Products() {
  return (
    <Layout>
      <Link className="btn-primary" href={"/products/new"}>Add new product</Link>
    </Layout>
  )
}