import React from 'react';

export const useRssImages = ({
  categories = ['https://digitalsignage.manninghamuc.org/ads/feed/'],
  fetchInterval = 30000,
  defaultFadeInterval = 5,
} = {}) => {
  const [images, setImages] = React.useState([]);

  React.useEffect(
    () => {
      let latestImages = images;

      const fetchImages = async () => {
        const fetchResults = await Promise.all(
          categories.map(category => fetchImagesFromCategory({
            category,
            defaultFadeInterval,
          }))
        );
  
        const images = [];
        while (fetchResults.some(result => result.length)) {
          fetchResults.forEach(result => {
            if (result.length) {
              images.push(result.shift());
            }
          });
        }
        
        if (JSON.stringify(latestImages) !== JSON.stringify(images)) {
          console.log('New images array', images);
          setImages(images);
          latestImages = images;
        }
      };

      fetchImages();

      const intervalHandle = setInterval(
        fetchImages,
        fetchInterval,
      );

      return () => {
        clearInterval(intervalHandle);
      }
    },
    [],
  );

  return images;
};

const fetchImagesFromCategory = async ({
  category,
  defaultFadeInterval,
}) => {
  console.log(`fetching images from ${category}`)
  const rss = await fetch(category);
  const rssBody = await rss.text();
  const body = rssBody.replace(/\<\/link\>/g, ' </link>');

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(body, 'text/html');
  var docImages = [...doc.querySelectorAll('item>content\\:encoded>img')];

  const images = docImages.map(docImage => ({
    src: docImage.attributes['srcset'].value.split(',').pop().trim().split(' ').shift(),
    fadeInterval: parseInt(docImage.attributes['alt'].value || `${defaultFadeInterval}`),
  }));

  return images;
};

