<script>
    import { account } from "../api.js";

    export default {
        computed: {
            filterDisabled() {
                if (this.filtered) return false;
                if (this.searched) return true;
                if (this.pagesCount === 0) return true;
            },
            filterIconName() {
                return this.filtered ? "filter_alt_off" : "filter_alt";
            },
            searchDisabled() {
                if (this.searched) return false;
                if (this.filtered) return true;
                if (this.pagesCount === 0) return true;
            },
            searchIconName() {
                return this.searched ? "search_off" : "search";
            }
        },
        data() {
            return {
                directoriesHidden: true,
                directoryMenu: {
                    "0": ["Должности сотрудников", "Alt + J"],
                    "1": ["Причины увольнения",    "Alt + R"]
                },
                directoryTimeout: null,
                menuHideTimeout: 3000,
                operationsHidden: true,
                operationsMenu: {
                    "0": ["Добавить",              "Alt + A"],
                    "1": ["Изменить",              "Alt + E"],
                    "2": ["Удалить",               "Alt + D"],
                    "3": ["Очистить",              "Alt + C"],
                    "5": ["Уволить",               "Alt + F"]
                },
                operationsTimeout: null
            }
        },
        emits: [
            "item-click",
            "show-help",
            "show-filter",
            "show-search",
            "show-settings"
        ],
        methods: {
            logout() {
                const self = this;
                const session = account.deleteSession("current");
                session.then(() => {
                    self.$root.userIsAuthorised = false;
                    self.$root.currentRoute = "/auth";
                    history.pushState(null, "", self.$root.currentRoute);
                });
            },
            toggleDirectoriesMenu() {
                if (this.directoriesHidden) {
                    this.directoriesHidden = false;
                    this.directoryTimeout = setTimeout(() => {
                        this.directoriesHidden = true;
                    }, this.menuHideTimeout);
                } else {
                    this.directoriesHidden = true;
                    clearTimeout(this.directoryTimeout);
                }
            },
            toggleOperationsMenu() {
                if (this.operationsHidden) {
                    this.operationsHidden = false;
                    this.operationsTimeout = setTimeout(() => {
                        this.operationsHidden = true;
                    }, this.menuHideTimeout);
                } else {
                    this.operationsHidden = true;
                    clearTimeout(this.operationsTimeout);
                }
            }
        },
        props: {
            filtered: {
                required: true,
                type: Boolean
            },
            pagesCount: {
                required: true,
                type: [Number, String]
            },
            searched: {
                required: true,
                type: Boolean
            }
        }
    }
</script>
<template>
    <aside class="menu has-background-light px-4 py-4">
        <p class="menu-label is-invisible m-0">
            ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
        </p>
        <p class="menu-label mt-0">Данные</p>
        <ul class="menu-list">
            <li>
                <a 
                    class="is-flex
                    is-align-items-center
                    is-justify-content-space-between has-text-black"
                    @click="toggleOperationsMenu">
                    <span class="is-flex is-align-items-center">
                        <span class="material-icons mr-3">ballot</span>
                        <span>Сотрудники</span>
                    </span>
                    <span v-if="operationsHidden">⮟</span>
                    <span v-else>⮝</span>
                </a>
                <ul>
                    <li
                        :class="{ 'is-hidden': operationsHidden }"
                        :key="name"
                        v-for="(value, name) in operationsMenu">
                        <a
                            :class="{
                                'is-disable': pagesCount === 0 &&
                                value[0] !== 'Добавить'
                            }"
                            @click="$emit('item-click', value[1])">
                            {{ value[0] }}
                        </a>
                    </li>
                </ul>
            </li>
            <li>
                <a
                    class="is-flex
                    is-align-items-center
                    is-justify-content-space-between has-text-black"
                    @click="toggleDirectoriesMenu">
                    <span class="is-flex is-align-items-center">
                        <span class="material-icons mr-3">
                            folder
                        </span>
                        <span>Справочники</span>
                    </span>
                    <span v-if="directoriesHidden">⮟</span>
                    <span v-else>⮝</span>
                </a>
                <ul>
                    <li
                        :class="{ 'is-hidden': directoriesHidden }"
                        :key="name"
                        v-for="(value, name) in directoryMenu">
                        <a @click="$emit('item-click', value[1])">
                            {{ value[0] }}
                        </a>
                    </li>
                </ul>
            </li>
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black"
                    :class="{ 'is-disable': pagesCount === 0 }"
                    @click="$emit('item-click', 'Alt + M')">
                    <span class="material-icons mr-3">
                        calendar_month
                    </span>
                    <span>График посещения</span>
                </a>
            </li>
        </ul>
        <p class="menu-label">Отбор</p>
        <ul class="menu-list">
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black"
                    :class="{ 'is-disable': filterDisabled }"
                    @click="$emit('show-filter')">
                    <span class="material-icons mr-3">
                        {{ filterIconName }}
                    </span>
                    <span>Фильтрация</span>
                </a>
            </li>
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black"
                    :class="{ 'is-disable': searchDisabled }"
                    @click="$emit('show-search')">
                    <span class="material-icons mr-3">
                        {{ searchIconName }}
                    </span>
                    <span>Поиск</span>
                </a>
            </li>
        </ul>
        <p class="menu-label">Обмен</p>
        <ul class="menu-list">
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black">
                    <span class="material-icons mr-3">file_upload</span>
                    <span>Импорт</span>
                </a>
            </li>
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black">
                    <span class="material-icons mr-3">file_download</span>
                    <span>Экспорт</span>
                </a>
            </li>
        </ul>
        <p class="menu-label">Система</p>
        <ul class="menu-list">
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black"
                    @click="$emit('show-settings')">
                    <span class="material-icons mr-3">settings</span>
                    <span>Настройки</span>
                </a>
            </li>
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black"
                    @click="$emit('show-help')">
                    <span class="material-icons mr-3">help</span>
                    <span>Справка</span>
                </a>
            </li>
            <li>
                <a
                    class="is-flex is-align-items-center has-text-black"
                    @click="logout">
                    <span class="material-icons mr-3">meeting_room</span>
                    <span>Выход</span>
                </a>
            </li>
        </ul>
    </aside>
</template>