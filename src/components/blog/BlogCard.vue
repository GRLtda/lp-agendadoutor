<script setup>
import { ArrowUpRight } from "lucide-vue-next";
import { blogQuery } from "@/blog/data";
defineProps({ post: { type: Object, required: true }, featured: Boolean });
const formatDate = (value) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
</script>
<template>
  <article class="ad-blog-card" :class="{ featured }">
    <a
      :href="`/blog/${post.slug}`"
      class="ad-blog-card-image"
      tabindex="-1"
      aria-hidden="true"
      ><img
        v-if="post.coverUrl"
        :src="post.coverUrl"
        alt=""
        :loading="featured ? 'eager' : 'lazy'"
        width="900"
        height="560"
    /></a>
    <div class="ad-blog-card-copy">
      <a
        class="ad-blog-category"
        :href="blogQuery({ category: post.category })"
        >{{ post.category }}</a
      >
      <h2>
        <a :href="`/blog/${post.slug}`">{{ post.title }}</a>
      </h2>
      <p>{{ post.excerpt }}</p>
      <div class="ad-blog-meta">
        <span>{{ post.author?.name }}</span
        ><span aria-hidden="true">·</span
        ><time :datetime="post.publishedAt">{{
          formatDate(post.publishedAt)
        }}</time>
      </div>
      <a class="ad-blog-read" :href="`/blog/${post.slug}`"
        >Ler artigo <ArrowUpRight :size="17"
      /></a>
    </div>
  </article>
</template>
