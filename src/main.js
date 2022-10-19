import { createApp, h } from "vue";
import { account } from "./api.js";
import conf from "./config.js";
import "bulma";
import "bulma-tooltip";

import App from "./App.vue";
import LoginModal from "./components/LoginModal.vue";
import PageNotFound from "./components/PageNotFound.vue";

const routes = {
    "/": App,
    "/auth": LoginModal
};

const Router = {
    created () {
        window.addEventListener("popstate", () => {
            this.currentRoute = window.location.pathname
        })
    },
    computed: {
        currentComponent() {
            if (this.currentRoute in routes === false) return PageNotFound;
            if (this.userIsAuthorised === false) return LoginModal;
            if (this.currentRoute === "/auth") return App;
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
            userIsAuthorised: false
        }
    },
    methods: {
        checkAuthorisation() {
            const auth = account.get();
            auth.then(user => {
                this.userIsAuthorised = true;
            }, error => {
                this.userIsAuthorised = false;
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
    mounted() {
        this.checkAuthorisation();
    },
    render() {
        return h(this.currentComponent);
    }
};

const app = createApp(Router);
app.config.unwrapInjectedRef = true;
const vm = app.mount("#app");
