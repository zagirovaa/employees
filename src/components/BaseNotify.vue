<script>
    export default {
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
        <slot></slot>
    </div>
</template>