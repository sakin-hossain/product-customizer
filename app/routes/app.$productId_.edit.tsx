// @ts-nocheck
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { BlockStack, Button, LegacyCard, Page, Tabs } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { DOMParser, XMLSerializer } from "xmldom";
import ImageTab from "~/components/ImageTab";
import MetaFieldList from "~/components/MetaFieldList";
import VariantsTab from "~/components/VariantsTab";
import { authenticate } from "~/shopify.server";
import { extractUniqueFillColors } from "~/utils/utils";
import indexStyles from "../routes/_index/style.css";

export const links = () => [{ rel: "stylesheet", href: indexStyles }];

export enum FormNames {
  SVG_FORM = "svg",
  VARIANT_FORM = "variant",
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const productDetails: any = await admin.rest.resources.Product.find({
    session: session,
    id: params.productId,
  });

  const metaFieldList = await admin.rest.resources.Metafield.all({
    session: session,
    metafield: { owner_id: params.productId, owner_resource: "product" },
  });

  const filteredMetaField = metaFieldList.data.filter(
    (item: any) => item.namespace === "caractere"
  );

  return json({
    productDetails: productDetails,
    metaFieldList: filteredMetaField,
    productId: params.productId,
  });
};

export async function action({ request, params }: ActionFunctionArgs) {
  await new Promise((res) => setTimeout(res, 1000));
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );

  // const formData = await request.formData();
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const formName = formData.get("formName");

  const { admin, session } = await authenticate.admin(request);

  const productDetails: any = await admin.rest.resources.Product.find({
    session: session,
    id: params.productId,
  });

  const metaFieldList = await admin.rest.resources.Metafield.all({
    session: session,
    metafield: { owner_id: params.productId, owner_resource: "product" },
  });

  const variantsMetaField = metaFieldList.data.filter(
    (item: any) => item.key === "product_customizer_variants"
  );
  const imageMetaField = metaFieldList.data.filter(
    (item: any) => item.key === "product_customizer_image"
  );

  switch (formName) {
    case FormNames.VARIANT_FORM:
      const label = formData.get("label");
      const option = formData.get("option");

      const parsedData = JSON.parse(variantsMetaField[0].value) || {};
      const existingData = parsedData.data;
      const productLength = productDetails.options.length;
      const id = productLength + existingData.length + 1;

      const updatedData = [
        ...existingData,
        { id: id, label: label, option: option },
      ];

      const product: any = new admin.rest.resources.Metafield({
        session: session,
      });
      product.product_id = params.productId;
      product.id = variantsMetaField[0].id;
      product.value = JSON.stringify({
        name: "caractere_product_customizer_variants",
        data: updatedData,
      });
      product.type = "single_line_text_field";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await product.save({
        update: true,
      });
      return json({ msg: "Added successfully" });
    case FormNames.SVG_FORM:
      const svg = formData.get("svg-image") as File;
      const svgData = await svg.text();

      console.log(svgData, "reader++++++++++++++++++++++++++++++");
      console.log(svg, "svg++++++++++++++++++++++++++++++");

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgData, "image/svg+xml");
      const paths = doc.getElementsByTagName("path");
      const colorIdMap = new Map<string, string>();

      let optionLength = productDetails.options.length;
      for (let i = 0; i < paths.length; i++) {
        const color = paths[i].getAttribute("fill");
        let id;
        if (colorIdMap.has(color)) {
          id = colorIdMap.get(color);
        } else {
          id = "option" + (optionLength + 1);
          colorIdMap.set(color, id);
          optionLength++;
        }
        paths[i].setAttribute("id", id);
      }
      const serializer = new XMLSerializer();
      const updatedSvg = serializer.serializeToString(doc);
      console.log(updatedSvg, "updatedSvg+++++++++++++++++++++++++");
      const image: any = new admin.rest.resources.Metafield({
        session: session,
      });
      image.product_id = params.productId;
      image.id = imageMetaField[0].id;
      image.value = JSON.stringify({
        name: "caractere_product_customizer_image",
        data: updatedSvg,
      });
      image.type = "single_line_text_field";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await image.save({
        update: true,
      });
      return json({
        msg: "Added successfully",
      });

    default:
      return json({ msg: "Clicked in default" });
  }
}

const ProductMetaFieldEdit = () => {
  const data = useActionData<typeof action>();
  const { productDetails, metaFieldList, productId } =
    useLoaderData<typeof loader>();

  const [selected, setSelected] = useState(1);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    []
  );

  const [uniqueColorLength, setUniqueColorLength] = useState<number>(0);
  const [variantLength, setVariantLength] = useState<number>(0);
  const [imageMetaField, setImageMetaField] = useState<any>(null);
  const [variantMetaField, setVariantMetaField] = useState<any>(null);

  useEffect(() => {
    metaFieldList.map((item: any) => {
      const name = JSON.parse(item.value);
      if (item.key === "product_customizer_image" && name.data.length > 0) {
        const uniqueFillColors = extractUniqueFillColors(name.data);
        setUniqueColorLength(uniqueFillColors.length);
        setImageMetaField(true);
      }

      if (item.key === "product_customizer_variants") {
        setVariantLength(name.data.length);
        setVariantMetaField(true);
      }
      return null;
    });
  }, [metaFieldList]);

  const tabs = [
    {
      id: "variant",
      content: "Variants",
      accessibilityLabel: "All customers",
      panelID: "all-customers-fitted-content-2",
      disable: !variantMetaField,
    },
    {
      id: "image",
      content: "Image",
      panelID: "accepts-marketing-fitted-Ccontent-2",
      disable: !imageMetaField,
    },
  ];

  const remainingColors = uniqueColorLength - variantLength;

  return (
    <Page
      narrowWidth
      backAction={{ content: "Products", url: `/app/${productDetails?.id}` }}
      title={productDetails?.title}
      primaryAction={
        <Button
          onClick={() =>
            window.open(
              `https://caractere-shop.nobrainerdev.ca/products/${productDetails.handle}`
            )
          }
          variant="primary"
        >
          See your variant
        </Button>
      }
    >
      <LegacyCard>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
          <LegacyCard.Section>
            <BlockStack gap={"400"}>
              {metaFieldList.map((item: any, index: number) => (
                <MetaFieldList
                  selected={selected}
                  item={item}
                  index={index}
                  key={index}
                  productId={productId}
                  remainingColors={remainingColors}
                />
              ))}
            </BlockStack>
            {selected === 0 ? (
              <VariantsTab
                data={data}
                metaFieldList={metaFieldList}
                productId={productId}
              />
            ) : (
              <ImageTab data={data} />
            )}
          </LegacyCard.Section>
        </Tabs>
      </LegacyCard>
    </Page>
  );
};

export default ProductMetaFieldEdit;
