import Layout from "@/components/layout/Layout";

export default function AdminTest() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Test Page</h1>
        <p className="text-gray-600 mb-4">
          If you can see this page, the routing is working correctly.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Admin route is accessible!
        </div>
      </div>
    </Layout>
  );
}
