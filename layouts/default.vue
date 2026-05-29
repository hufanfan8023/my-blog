<template>
  <div class="layout-default">
    <a href="#main" class="sr-only focus:not-sr-only">跳到主内容</a>
    <BgAnimation />
    <AppHeader />
    <MobileMenu />
    <main id="main" class="main">
      <slot />
    </main>
    <AppFooter />
    <SearchModal />
  </div>
</template>

<style scoped>
.layout-default {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;
}
</style>
