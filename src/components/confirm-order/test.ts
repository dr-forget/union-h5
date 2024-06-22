export const filterSkusByAttributeValues = (selectedAttributes: { id: number; specid: string }[], skuList: any[]) => {
  const filteredSkus = skuList.filter((sku) => {
    return selectedAttributes.every((selectedAttribute) => sku.attributes.some((attribute) => attribute.id === selectedAttribute.id && attribute.spec_id === selectedAttribute.specid));
  });

  return filteredSkus;
};
