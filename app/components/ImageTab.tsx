import { Form } from "@remix-run/react";
import { Badge, Button, FormLayout, InlineStack } from "@shopify/polaris";
import { FormNames } from "~/routes/app.$productId_.edit";

const ImageTab = ({ data }: any) => {
  return (
    <div>
      <Form method="post" encType="multipart/form-data">
        <input type="hidden" name="formName" value={FormNames.SVG_FORM} />
        <FormLayout>
          {data?.msg && <Badge tone="success">{data?.msg}</Badge>}
          <label htmlFor="svg-image">Please give your svg code here</label>
          <textarea
            name="svg-image"
            id="svg-image"
            cols={50}
            rows={20}
          ></textarea>
          {/* <label htmlFor="svg-upload">Upload your SVG file here</label>
          <input type="file" id="svg-image" accept=".svg" name="svg-image" /> */}
          <InlineStack align="end">
            <Button submit variant="primary" size="large">
              Save
            </Button>
          </InlineStack>
        </FormLayout>
      </Form>
    </div>
  );
};

export default ImageTab;
