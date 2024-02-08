import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const product_id = params.productId;
  const metafield_id = params.metaId;

  const metaFieldDetails: any = await admin.rest.resources.Metafield.find({
    session: session,
    product_id: params.productId,
    id: params.metaId,
  });

  const parsedValue = JSON.parse(metaFieldDetails.value);
  const metaFieldValues = parsedValue.data;

  const filteredMetaFieldValue: any = metaFieldValues.filter(
    (value: any) => value.id != params.variantId
  );

  const product: any = new admin.rest.resources.Metafield({ session: session });
  const body = JSON.stringify({
    name: "caractere_product_customizer",
    data: filteredMetaFieldValue,
  });

  product.product_id = product_id;
  product.id = metafield_id;
  product.value = body;
  product.type = "single_line_text_field";
  await product.save({
    update: true,
  });

  return redirect(`/app/${params.productId}/edit`);
}
