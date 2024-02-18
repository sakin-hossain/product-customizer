import { Form } from "@remix-run/react";
import { Badge, Button, FormLayout, InlineStack } from "@shopify/polaris";
import { FormNames } from "~/routes/app.$productId_.edit";

const ImageTab = ({ data }: any) => {
  return (
    <div>
      <Form method="post" encType="multipart/form-data">
        <FormLayout>
          {data?.msg && <Badge tone="success">{data?.msg}</Badge>}
          <input type="hidden" name="formName" value={FormNames.SVG_FORM} />
          <label htmlFor="images" className="drop-container" id="dropcontainer">
            <input
              type="file"
              accept=".svg"
              name="svg-image"
              id="images"
              required
            />
          </label>
          <InlineStack align="end">
            <Button submit variant="primary" size="large">
              Upload your SVG
            </Button>
          </InlineStack>
        </FormLayout>
      </Form>
    </div>
  );
};

export default ImageTab;
