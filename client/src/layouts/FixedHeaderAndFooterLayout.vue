<template>
  <div class="flex flex-col">
    <header>
      <slot name="header"></slot>
    </header>
    <main class="flex-1 overflow-y-auto">
      <slot></slot>
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
