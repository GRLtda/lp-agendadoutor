<script setup>
import { onMounted, ref } from "vue";
import { ArrowRight } from "lucide-vue-next";
import AppButton from "@/components/global/AppButton.vue";
import BlogCard from "@/components/blog/BlogCard.vue";
import { loadBlogPage } from "@/blog/data";
import "@/assets/css/blog.css";
const posts = ref([]);
onMounted(async () => {
  try {
    const page = await loadBlogPage("/blog", {});
    posts.value = page.result?.data.slice(0, 3) || [];
  } catch {
    /* The link remains available when the feed cannot load. */
  }
});
</script>
<template>
  <section
    id="blog"
    class="home-blog ad-blog-page"
    aria-labelledby="home-blog-title"
  >
    <div class="home-blog-inner">
      <header class="home-blog-heading">
        <div>
          <span class="ad-blog-kicker">BLOG AGENDA DOUTOR</span>
          <h2 id="home-blog-title">Uma nova leitura<br />para a sua rotina.</h2>
          <p>
            Saúde, tecnologia e gestão. Conhecimento para acompanhar o que
            acontece dentro e fora da clínica.
          </p>
        </div>
        <AppButton
          href="/blog"
          variant="outline"
          size="lg"
          data-track-click="home_blog_ver_artigos"
          >Explorar o blog <ArrowRight :size="18"
        /></AppButton>
      </header>
      <div v-if="posts.length" class="ad-blog-grid">
        <BlogCard v-for="post in posts" :key="post._id" :post="post" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.home-blog {
  min-height: 0;
  padding: 80px 24px;
  border-top: 1px solid #e6ebf5;
}
.home-blog-inner {
  max-width: 1152px;
  margin: auto;
}
.home-blog-heading {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  align-items: center;
  margin-bottom: 40px;
}
.home-blog-heading h2 {
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 600;
  margin: 0 0 20px;
  letter-spacing: -0.04em;
}
.home-blog-heading p {
  max-width: 600px;
  font-size: 16px;
  line-height: 1.75;
  color: #64748b;
  margin: 0;
}
@media (max-width: 600px) {
  .home-blog {
    padding: 48px 16px;
  }
  .home-blog-heading {
    display: block;
  }
  .home-blog-heading .app-button {
    margin-top: 24px;
  }
}
</style>
