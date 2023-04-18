<template>
  <section class="carousel">
    <div class="carousel-item" v-for="(image, index) in images" :key="index">
      <img :src="image.url" :alt="image.alt" />
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      images: [
        { url: 'image1.jpg', alt: 'Image 1' },
        { url: 'image2.jpg', alt: 'Image 2' },
        { url: 'image3.jpg', alt: 'Image 3' },
        { url: 'image4.jpg', alt: 'Image 4' },
        { url: 'image5.jpg', alt: 'Image 5' },
      ],
    };
  },
};
</script>
