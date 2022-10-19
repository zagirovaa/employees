<script>
    export default {
        methods: {
            goToHomePage() {
                this.$root.currentRoute = "/";
                history.pushState(null, "", this.$root.currentRoute);
            }
        }
    }
</script>

<template>
    <div class="columns">
        <div class="column is-one-fifth"></div>
        <div class="column is-three-fifth has-text-centered">
            <figure class="image is-inline-block">
                <img src="/src/assets/error-404.png">
            </figure>
            <h1 class="title is-1">СТРАНИЦА НЕ НАЙДЕНА</h1>
            <h3 class="subtitle is-3">
                введен адрес несуществующего ресурса
            </h3>
            <h5 class="subtitle is-5">
                для работы с приложение перейдите на главную страницу
            </h5>
            <button
                class="button"
                @click="goToHomePage">
                ПЕРЕЙТИ НА ГЛАВНУЮ СТРАНИЦУ
            </button>
        </div>
        <div class="column is-one-fifth"></div>
    </div>
</template>