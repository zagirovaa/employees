<script>
    import { account } from "../api.js";
    import conf from "../config.js";
    
    export default {
        data() {
            return {
                conf: conf
            }
        },
        emits: [
            "change-page"
        ],
        props: {
            currentPage: {
                required: true,
                type: [Number, String]
            },
            pagesCount: {
                required: true,
                type: [Number, String]
            }
        }
    }
</script>

<template>
    <nav class="navbar is-fixed-top">
        <div class="navbar-brand">
            <div class="navbar-item pr-0">
                <a class="button is-small is-link px-1">
                    <span class="material-icons">hive</span>
                </a>
            </div>
            <a
                class="navbar-item"
                target="_blank"
                :href="conf.organization.url">
                <h4 class="subtitle is-4 has-text-link">
                    <span class="has-text-weight-bold">
                        {{ conf.organization.name }} :
                    </span>
                    Сотрудники
                </h4>
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a
                            class="button is-small is-link px-1"
                            :class="{ 'is-disable': pagesCount === 0 }"
                            @click="$emit('change-page', 'first')">
                            <span class="material-icons">
                                first_page
                            </span>
                        </a>
                        <a
                            class="button is-small is-link px-1"
                            :class="{ 'is-disable': pagesCount === 0 }"
                            @click="$emit('change-page', 'previous')">
                            <span class="material-icons">
                                navigate_before
                            </span>
                        </a>
                        <a
                            class="button is-white"
                            :class="{ 'is-disable': pagesCount === 0 }">
                            {{ currentPage }} из {{ pagesCount }}
                        </a>
                        <a
                            class="button is-small is-link px-1"
                            :class="{ 'is-disable': pagesCount === 0 }"
                            @click="$emit('change-page', 'next')">
                            <span class="material-icons">
                                navigate_next
                            </span>
                        </a>
                        <a
                            class="button is-small is-link px-1"
                            :class="{ 'is-disable': pagesCount === 0 }"
                            @click="$emit('change-page', 'last')">
                            <span class="material-icons">
                                last_page
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>