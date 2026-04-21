// Helper to unwrap Strapi v5 response to v4-like structure
export const unwrapResponse = (res) => {
  if (!res?.data) return res;

  // Strapi v5 returns: { data: [...] } where items don't have "attributes" wrapper  
  // Strapi v4 returned: { data: [{ id: 1, attributes: {...} }], meta: {...} }
  // Frontend expects: res.data.data to be array of { id, attributes: {...} }

  const strapiResponseData = res.data.data || res.data;

  // Recursively normalize populated fields (relations, media)
  const normalizePopulatedField = (field) => {
    if (!field) return null;

    // If it's an array of items (many relation)
    if (Array.isArray(field)) {
      return field.map(item => normalizePopulatedField(item));
    }

    // If it has id/documentId, it's a relation or media
    if (field.id || field.documentId) {
      const { id, documentId, ...rest } = field;

      // Recursively process nested fields
      const processedRest = {};
      for (const key in rest) {
        if (typeof rest[key] === 'object' && rest[key] !== null) {
          processedRest[key] = normalizePopulatedField(rest[key]);
        } else {
          processedRest[key] = rest[key];
        }
      }

      return {
        data: {
          id: id || documentId,
          attributes: processedRest
        }
      };
    }

    return field;
  };

  const normalizeItem = (item) => {
    if (!item) return null;

    // Extract id/documentId and move everything else into attributes
    const { id, documentId, ...rest } = item;

    // Process each field - if it's a populated relation/media, normalize it
    const processedAttributes = {};
    for (const key in rest) {
      if (typeof rest[key] === 'object' && rest[key] !== null) {
        processedAttributes[key] = normalizePopulatedField(rest[key]);
      } else {
        processedAttributes[key] = rest[key];
      }
    }

    return {
      id: id || documentId,
      documentId: documentId || id,  // Preserve documentId for Strapi v5 API calls
      attributes: processedAttributes
    };
  };


  let normalizedData;

  if (Array.isArray(strapiResponseData)) {
    normalizedData = strapiResponseData.map(normalizeItem);
  } else if (strapiResponseData) {
    normalizedData = normalizeItem(strapiResponseData);
  } else {
    normalizedData = [];
  }

  // Return the modified response with the normalized structure
  return {
    ...res,
    data: {
      data: normalizedData,
      meta: res.data.meta || {}
    }
  };
};
