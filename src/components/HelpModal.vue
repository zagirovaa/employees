<script>
    import BaseModal from "./BaseModal.vue"

    export default {
        components: { BaseModal },
        computed: {
            current_year() {
                return new Date().getFullYear();
            },
            used_tech() {
                return this.tech_list.join(" ✦ ");
            }
        },
        data() {
            return {
                app_name: "Сотрудники",
                app_developer: "Загиров Абдул Аскерович",
                app_org: "NETCON",
                app_version: "1.0.0",
                created_year: 2019,
                tech_list: [
                    "Html",
                    "Css",
                    "JavaScript",
                    "Bulma",
                    "VueJS",
                    "MaterialIcons",
                    "AppWrite"
                ],
                title: "Справка",
            }
        }
    }
</script>

<template>
    <BaseModal
        :title="title">
        <template v-slot:body>
            <section
                class="modal-card-body has-text-centered">
                <h3 class="title is-3 has-text-link">{{ app_name }}</h3>
                <h5 class="subtitle is-5">Версия {{ app_version }}</h5>
                <h6 class="subtitle is-6">
                    <span class="has-text-link">
                        - Создана используя -
                    </span><br>
                    {{ used_tech }}
                </h6>
                <h6 class="subtitle is-6">
                    <span class="has-text-link">
                        - Разработчик -
                    </span><br>
                    {{ app_developer }}
                </h6>
            </section>
        </template>
        <template v-slot:footer>
            <footer
                class="modal-card-foot is-flex is-justify-content-center">
                <h6 class="subtitle is-6">
                    Все права защищены &copy; {{ app_org }} {{ created_year }}
                    <span v-if="current_year > created_year">
                         - {{ current_year }}
                    </span>
                </h6>
            </footer>
        </template>
    </BaseModal>
</template>