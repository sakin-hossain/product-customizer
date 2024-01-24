import { authenticate } from "~/shopify.server";

export async function createMetaFields({ request }: any, id: any, title: any) {
  const { admin, session } = await authenticate.admin(request);

  const product = new admin.rest.resources.Product({ session: session });

  product.id = id;
  product.metafields = [
    {
      key: "new",
      value: title,
      type: "single_line_text_field",
      namespace: "global",
    },
  ];
  await product.save({
    update: true,
  });
}
