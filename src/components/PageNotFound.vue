<script>
    export default {
        methods: {
            setHeight() {
                const block = document.querySelector(".content404");
                block.style.height = `${window.innerHeight}px`;
            },
            goToHomePage() {
                this.$root.currentRoute = "/";
                history.pushState(null, "", this.$root.currentRoute);
            }
        },
        mounted() {
            window.addEventListener("resize", this.setHeight);
            this.setHeight();
        }
    }
</script>

<template>
    <div class="columns is-vcentered content404">
        <div class="column has-text-centered">
            <figure class="image is-inline-block">
                <img src="/src/assets/404.png">
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
    </div>
    
</template>