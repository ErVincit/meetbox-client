<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap");

* {
  margin: 0;
  padding: 0;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
}

body {
  --primary-bg-color: #efeeee;
  --secondary-bg-color: #efeeee;
  --primary: #4e8fe7;
  --secondary: grey;
  --danger: rgb(252, 109, 109);

  --text-color-primary: white;
  --text-color-bg: #787878;

  --file-drop-border: purple;
  --big-add-border: lightgrey;
  --grid-border: lightgrey;
}

html,
body,
#app {
  background-color: var(--primary-bg-color);
  overflow: hidden;
  height: 100%;
}
</style>
