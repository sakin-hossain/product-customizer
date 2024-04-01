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
import {
  extractUniqueFillColors,
  generateColorVariantsArray,
} from "~/utils/utils";
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
    // case FormNames.VARIANT_FORM:
    //   const label = formData.get("label");
    //   const option = formData.get("option");

    //   const parsedData = JSON.parse(variantsMetaField[0].value) || {};
    //   const existingData = parsedData.data;
    //   const productLength = productDetails.options.length;
    //   const id = productLength + existingData.length + 1;

    //   const updatedData = [
    //     ...existingData,
    //     { id: id, label: label, option: option },
    //   ];

    //   const product: any = new admin.rest.resources.Metafield({
    //     session: session,
    //   });
    //   product.product_id = params.productId;
    //   product.id = variantsMetaField[0].id;
    //   product.value = JSON.stringify({
    //     name: "caractere_product_customizer_variants",
    //     data: updatedData,
    //   });
    //   product.type = "single_line_text_field";
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   await product.save({
    //     update: true,
    //   });
    //   return json({ msg: "Added successfully" });
    case FormNames.SVG_FORM:
      let optionLength = productDetails.options.length;
      const svg = formData.get("svg-image") as File;
      const svgData = await svg.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(svgData, "image/svg+xml");

      const styleTag = doc.getElementsByTagName("style")[0];
      // Extract the CSS content from the style tag
      const cssContent = styleTag.textContent;

      // Regex to match 'fill' properties
      const fillRegex = /\.([^{]+)\s*{\s*fill:\s*([^;]+);/g;

      let fillColors = [];
      let classFillMap = {};
      let updatedClassFillMap = {};

      let match;
      while ((match = fillRegex.exec(cssContent)) !== null) {
        const className = match[1].trim();
        const fillColor = match[2].trim();
        if (fillColor !== "none") {
          if (!classFillMap[className]) {
            classFillMap[className] = fillColor;
            fillColors.push(fillColor);
          }
        }
      }

      // Filter out unique fill colors
      fillColors = Array.from(new Set(fillColors));

      // Iterate through each class in classFillMap
      for (const classNames in classFillMap) {
        if (classFillMap.hasOwnProperty(classNames)) {
          const normalizedClassNames = classNames.replace(/\s+/g, "");
          const individualClassNames = normalizedClassNames
            .split(",")
            .map((className) => className.trim());

          // eslint-disable-next-line no-loop-func
          individualClassNames.forEach((className) => {
            optionLength++;
            const strippedClassName = className.startsWith(".")
              ? className.slice(1)
              : className;
            updatedClassFillMap[strippedClassName] = classFillMap[classNames];
            const elements = doc.getElementsByClassName(className);
            for (let i = 0; i < elements.length; i++) {
              const element = elements[i];
              element.setAttribute("id", `option${optionLength + 1}`);
            }
          });
        }
      }

      // Serialize the modified SVG document back to a string
      const serializer = new XMLSerializer();
      const modifiedSvgData = serializer.serializeToString(doc);

      console.log(modifiedSvgData);

      const colorVariants = generateColorVariantsArray(
        updatedClassFillMap,
        productDetails
      );

      console.log(colorVariants, "colorVariants-_-_-_-");
      if (colorVariants) {
        const product: any = new admin.rest.resources.Metafield({
          session: session,
        });
        product.product_id = params.productId;
        product.id = variantsMetaField[0].id;
        product.value = JSON.stringify({
          name: "caractere_product_customizer_variants",
          data: colorVariants,
        });
        product.type = "single_line_text_field";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await product.save({
          update: true,
        });
      }
      const image: any = new admin.rest.resources.Metafield({
        session: session,
      });
      image.product_id = params.productId;
      image.id = imageMetaField[0].id;
      image.value = JSON.stringify({
        name: "caractere_product_customizer_image",
        data: modifiedSvgData,
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

  const [selected, setSelected] = useState(0);

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
      id: "image",
      content: "Image",
      panelID: "accepts-marketing-fitted-Ccontent-2",
      disable: !imageMetaField,
    },
    {
      id: "variant",
      content: "Variants",
      accessibilityLabel: "All customers",
      panelID: "all-customers-fitted-content-2",
      disable: !variantMetaField,
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
              <ImageTab data={data} />
            ) : (
              <VariantsTab
                data={data}
                metaFieldList={metaFieldList}
                productId={productId}
              />
            )}
          </LegacyCard.Section>
        </Tabs>
      </LegacyCard>
    </Page>
  );
};

export default ProductMetaFieldEdit;
