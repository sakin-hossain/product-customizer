import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import { Layout, Page } from "@shopify/polaris";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const name = body.get("visitorsName");
  return json({ message: `Hello, ${name}` });
}

export default function AdditionalPage() {
  const data = useActionData<typeof action>();
  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Form method="post">
            <input type="text" name="visitorsName" />
            {data ? data.message : "Waiting..."}
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
