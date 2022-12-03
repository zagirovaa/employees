import { createApp, h } from "vue";
import "bulma";
import "@cityssm/bulma-sticky-table/bulma-with-sticky-table.css";
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
        // When moving between pages from history
        // currentRoute must be changed accordingly
        window.addEventListener("popstate", () => {
            this.currentRoute = window.location.pathname;
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
        async checkAuthorisation() {
            const auth = account.get();
            auth.then(user => {
                this.userIsAuthorised = true;
            }, error => {
                this.userIsAuthorised = false;
                console.log(error);
            });
        },
        showNotify(data) {
            this.notify.text = data.text;
            this.notify.type = data.type;
            this.notify.visible = true;
            setTimeout(() => {
                this.notify.visible = false;
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

document.title = `${conf.organization.name} : ${conf.app.name}`;