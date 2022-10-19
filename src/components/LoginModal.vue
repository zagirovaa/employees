<script>
    import { account } from "../api.js";
    import BaseModal from "./BaseModal.vue";
    import BaseNotify from "./BaseNotify.vue";

    export default {
        components: { BaseModal, BaseNotify },
        data() {
            return {
                email: "",
                password: "",
                title: "Авторизация"
            }
        },
        emits: ["click", "close-modal", "login", "show-notify"],
        methods: {
            signIn() {
                const self = this;
                if (this.email == "") {
                    this.$root.showNotify({
                        text: "Укажите адрес почтового ящика.",
                        type: "warning"
                    });
                    return;
                }
                if (this.password == "") {
                    this.$root.showNotify({
                        text: "Укажите пароль к учетной записи.",
                        type: "warning"
                    });
                    return;
                }
                const session = account.createEmailSession(
                    this.email,
                    this.password
                );
                session.then(user => {
                    self.$root.userIsAuthorised = true;
                    self.$root.currentRoute = "/";
                    history.pushState(null, "", self.$root.currentRoute);
                    self.$root.showNotify({
                        text: "Авторизация прошла успешно.",
                        type: "success"
                    });
                }, function (error) {
                    self.$root.showNotify({
                        text: "Неверные учетные данные.",
                        type: "danger"
                    });
                });
            }
        }
    }
</script>

<template>
    <div>
        <BaseModal
            :title="title"
            @close-modal="$emit('close-modal')">
            <template v-slot:body>
                <section class="modal-card-body">
                    <div class="field">
                        <p class="control">
                            <label class="label">Адрес электронной почты:</label>
                            <input
                                class="input"
                                placeholder="sergeevav@gmail.com"
                                type="email"
                                v-model.trim="email">
                        </p>
                    </div>
                    <div class="field">
                        <p class="control">
                            <label class="label">Пароль:</label>
                            <input
                                class="input"
                                type="password"
                                v-model.trim="password">
                        </p>
                    </div>
                </section>
            </template>
            <template v-slot:footer>
                <footer class="modal-card-foot">
                    <button
                        class="button is-link"
                        @click="signIn">
                        Войти
                    </button>
                </footer>
            </template>
        </BaseModal>
        <BaseNotify
            :type="$root.notify.type"
            v-if="$root.notify.visible"
            @close-notify="$root.notify.visible = false">
            {{ $root.notify.text }}
        </BaseNotify>
    </div>
</template>