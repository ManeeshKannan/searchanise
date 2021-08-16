exports.products = (data) => {
    let products = [];

    data.map((items) => {
        let variants = [];
        let options = [];
        const shopify_variants = items.shopify_variants;
        shopify_variants.map((el) => {
            const data = {
                sku: el.sku,
                title: el.title,
                price: el.price,
                compare_at_price: el.list_price,
                id: el.variant_id,
                inventory_management: el.inventory_management,
                inventory_policy: el.inventory_policy,
                inventory_quantity: el.inventory_quantity,
            };

            options.push(el.options);
            variants.push(data);
        });

        const product = {
            published_at: items.published_at,
            cursor: items.cursor,
            id: items.product_id,
            title: items.title,
            handle: items.handle,
            body_html: items.body_html,
            sub_title: items.sub_title,
            vendor: items.vendor,
            product_type: items.product_type,
            onlineStoreUrl: items.link,
            created_at: items.created_at,
            updated_at: items.updated_at,
            tags: items.tags,
            images: items.shopify_images,
            image: items.image_link,
            options,
            variants,
        };

        products.push(product);
    });
    return products;
};

exports.filter = (facetArray) => {
    let facets = [];

    facetArray.map((items) => {
        let values = [];
        const value = items.buckets;

        value.map((el) => {
            const valuesData = {
                name: el.value,
                alias: el.value,
                count: el.count,
            };
            values.push(valuesData);
        });

        const finalFacetData = {
            title: items.title,
            alias: items.attribute,
            values,
        };

        facets.push(finalFacetData);
    });
    return facets;
};