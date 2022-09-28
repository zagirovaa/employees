<script>
    import conf from "../config.js";
    
    export default {
        data() {
            return {
                conf: conf,
                directoryMenu: {
                    "0": ["Должности сотрудников", "Alt + J"],
                    "1": ["Причины увольнения",    "Alt + R"]
                },
                limitItems: [5, 10, 15, 20, 25, 50, 100],
                operationsMenu: {
                    "0": ["Добавить",              "Alt + A"],
                    "1": ["Изменить",              "Alt + E"],
                    "2": ["Удалить",               "Alt + D"],
                    "3": ["Очистить",              "Alt + C"],
                    "4": ["-",                     ""       ],
                    "5": ["Уволить",               "Alt + F"],
                    "6": ["-",                     ""       ],
                    "7": ["Пропуски",              "Alt + M"]
                }
            }
        },
        emits: [
            "change-limit",
            "change-page",
            "item-click",
            "show-help",
            "show-filter",
            "show-search",
            "show-settings"
        ],
        props: {
            currentPage: [Number, String],
            pagesCount: [Number, String],
            rowsPerPage: [Number, String]
        }
    }
</script>

<template>
    <nav class="navbar is-link">
        <div class="navbar-brand">
            <a
                class="navbar-item has-tooltip-bottom"
                target="_blank"
                :data-tooltip="conf.organization.tooltip"
                :href="conf.organization.url">
                <span class="material-icons md-36 mr-3">
                    admin_panel_settings
                </span>
                <h5 class="has-text-white has-text-weight-medium is-size-5">
                    {{ conf.organization.name }} : Сотрудники
                </h5>
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        <span class="material-icons mr-2">ballot</span>
                        <span>Операции</span>
                    </a>
                    <div class="navbar-dropdown">
                        <template
                            :key="name"
                            v-for="(value, name) in operationsMenu">
                            <hr class="navbar-devider" v-if="value[0] == '-'">
                            <a
                                class="navbar-item"
                                v-else
                                @click="$emit('item-click', value[1])">
                                <span class="tag mr-4">{{ value[1] }}</span>
                                <span>{{ value[0] }}</span>
                            </a>
                        </template>
                    </div>
                </div>
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        <span class="material-icons mr-2">folder</span>
                        <span>Справочники</span>
                    </a>
                    <div class="navbar-dropdown">
                        <template
                            :key="name"
                            v-for="(value, name) in directoryMenu">
                            <hr class="navbar-devider" v-if="value[0] == '-'">
                            <a
                                class="navbar-item"
                                v-else
                                @click="$emit('item-click', value[1])">
                                <span class="tag mr-4">{{ value[1] }}</span>
                                <span>{{ value[0] }}</span>
                            </a>
                        </template>
                    </div>
                </div>
            </div>
            <div class="navbar-end">
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Первая страница"
                    @click="$emit('change-page', 'first')">
                    <span class="material-icons">first_page</span>
                </a>
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Предыдущая страница"
                    @click="$emit('change-page', 'previous')">
                    <span class="material-icons">navigate_before</span>
                </a>
                <a class="navbar-item">
                    {{ currentPage }} из {{ pagesCount }}
                </a>
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Следующая страница"
                    @click="$emit('change-page', 'next')">
                    <span class="material-icons">navigate_next</span>
                </a>
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Последняя страница"
                    @click="$emit('change-page', 'last')">
                    <span class="material-icons">last_page</span>
                </a>
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        <span
                            class="material-icons mr-2 has-tooltip-left"
                            data-tooltip="Записей на странице">
                            layers
                        </span>
                    </a>
                    <div class="navbar-dropdown">
                        <a
                            class="navbar-item"
                            :class="{'is-active': rowsPerPage == value}"
                            :key="index"
                            v-for="(value, index) in limitItems"
                            @click="$emit('change-limit', value)">
                            {{ value }}
                        </a>
                    </div>
                </div>
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Поиск"
                    @click="$emit('show-search')">
                    <span class="material-icons">person_search</span>
                </a>
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Фильтрация"
                    @click="$emit('show-filter')">
                    <span class="material-icons">filter_alt</span>
                </a>
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Настройки программы"
                    @click="$emit('show-settings')">
                    <span class="material-icons">settings</span>
                </a>
                <a
                    class="navbar-item has-tooltip-left"
                    data-tooltip="Краткая справка о программе"
                    @click="$emit('show-help')">
                    <span class="material-icons">help</span>
                </a>
            </div>
        </div>
    </nav>
</template>