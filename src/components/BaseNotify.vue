<script>
    export default {
        computed: {
            icon() {
                switch (this.type) {
                    case "success":
                        return "info";
                        break;
                    case "warning":
                        return "warning";
                        break;
                    case "danger":
                        return "error";
                        break;
                }
            }
        },
        emits: ["close-notify"],
        props: {
            type: String
        }
    }
</script>

<template>
    <div
        class="notification"
        :class="{
            'is-success': type === 'success',
            'is-warning': type === 'warning',
            'is-danger': type === 'danger'
        }">
        <button class="delete" @click="$emit('close-notify')"></button>
        <span class="icon-text">
            <span class="material-icons mr-4">{{ icon }}</span>
            <span><slot></slot></span>
        </span>
    </div>
</template>