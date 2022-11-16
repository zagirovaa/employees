import { createApp, h } from "vue";
import "bulma";
import "bulma-tooltip";

import { account } from "./api.js";
import conf from "./config.js";

import App from "./App.vue";
import LoginModal from "./components/LoginModal.vue";
import PageNotFound from "./components/PageNotFound.vue";
import BaseEmpty from "./components/BaseEmpty.vue";

const routes = {
    "/": App,
    "/auth": LoginModal
};

const Router = {
    created () {
        const self = this;
        // When moving between pages from history
        // currentRoute must be changed accordingly
        window.addEventListener("popstate", () => {
            self.currentRoute = window.location.pathname;
        });
        this.checkAuthorisation();
    },
    computed: {
        currentComponent() {
            if (this.currentRoute in routes === false) return PageNotFound;
            if (this.userIsAuthorised === null) return BaseEmpty;
            if (this.userIsAuthorised === false) {
                this.currentRoute = "/auth";
                history.pushState(null, "", this.currentRoute);
                return LoginModal;
            }
            if (this.currentRoute === "/auth") {
                this.currentRoute = "/";
                history.pushState(null, "", this.currentRoute);
                return App;
            }
            return routes[this.currentRoute];
        }
    },
    data() {
        return {
            currentRoute: window.location.pathname,
            notify: {
                text: "",
                timeout: 2000,
                type: "",
                visible: false
            },
            userIsAuthorised: null
        }
    },
    methods: {
        checkAuthorisation() {
            const self = this;
            const auth = account.get();
            auth.then(user => {
                self.userIsAuthorised = true;
            }, error => {
                self.userIsAuthorised = false;
                console.log(error);
            });
        },
        showNotify(data) {
            const self = this;
            this.notify.text = data.text;
            this.notify.type = data.type;
            this.notify.visible = true;
            setTimeout(() => {
                self.notify.visible = false;
            }, this.notify.timeout);
        }
    },
    render() {
        return h(this.currentComponent);
    }
};

const app = createApp(Router);
app.config.unwrapInjectedRef = true;
const vm = app.mount("#app");
const APP_NAME = "Сотрудники";

document.title = `${conf.organization.name} : ${APP_NAME}`;
