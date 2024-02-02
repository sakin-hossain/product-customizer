// import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { Form, useActionData, useLoaderData } from "@remix-run/react";
// import {
//   Badge,
//   Button,
//   Card,
//   FormLayout,
//   Page,
//   TextField,
// } from "@shopify/polaris";
// import { useState } from "react";
// import { authenticate } from "~/shopify.server";

// export const loader = async ({ request, params }: LoaderFunctionArgs) => {
//   const { admin, session } = await authenticate.admin(request);

//   const metaFieldDetails = await admin.rest.resources.Metafield.find({
//     session: session,
//     product_id: params.productId,
//     id: params.metaId,
//   });

//   return json({
//     metaFieldDetails: metaFieldDetails,
//     product_id: params.productId,
//   });
// };

// export async function action({ request, params }: ActionFunctionArgs) {
//   const product_id = params.productId;
//   const metafield_id = params.metaId;

//   const formData = await request.formData();

//   const label = formData.get("label");
//   const option = formData.get("option");

//   const { admin, session } = await authenticate.admin(request);
//   const product: any = new admin.rest.resources.Metafield({ session: session });
//   const body = JSON.stringify({ label: label, option: option });

//   product.product_id = product_id;
//   product.id = metafield_id;
//   product.value = body;
//   product.type = "single_line_text_field";
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const response = await product.save({
//     update: true,
//   });

//   return json({ msg: "Update successfully" });
// }

// export default function EditMetaField() {
//   const { metaFieldDetails, product_id } = useLoaderData<typeof loader>();
//   const data = useActionData<typeof action>();

//   const parsedValue = JSON.parse(metaFieldDetails.value);
//   const [label, setLabel] = useState<string>(parsedValue.label);
//   const [option, setOption] = useState<any>(parsedValue.option);

//   console.log(metaFieldDetails, "metaFieldDetails");
//   return (
//     <Page
//       backAction={{ content: "Meta Field Details", url: `/app/${product_id}` }}
//       title={label}
//     >
//       <div style={{ margin: "16px 0" }}>
//         {data?.msg && <Badge tone="success">{data?.msg}</Badge>}
//       </div>
//       <Card>
//         <Form method="post">
//           <FormLayout>
//             <TextField
//               id="label"
//               name="label"
//               label="Label"
//               autoComplete="off"
//               value={label}
//               onChange={(value) => setLabel(value)}
//             />
//             <TextField
//               id="option"
//               name="option"
//               label="Option"
//               autoComplete="off"
//               value={option}
//               onChange={(value) => setOption(value)}
//             />
//             <Button variant="primary" submit>
//               Update Variant
//             </Button>
//           </FormLayout>
//         </Form>
//       </Card>
//     </Page>
//   );
// }

const EditVariant = () => {
  return <div>Hello variant</div>;
};

export default EditVariant;
