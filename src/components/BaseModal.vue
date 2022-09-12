<script>
    export default {
        emits: ["apply-changes", "close-modal"],
        mounted() {
            document.addEventListener("keydown", (event) => {
                const e = event || window.event;
                const escPressed = e.key == "Esc" || e.key == "Escape";
                const enterPressed = e.key == "Enter";
                if (escPressed) {
                    this.$emit("close-modal");
                }
                if (enterPressed) {
                    this.$emit("apply-changes");
                }
            });
        },
        props: {
            title: String
        }
    }
</script>

<template>
    <div class="modal is-active">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{ title }}</p>
                <button
                    class="delete"
                    @click="$emit('close-modal')">
                </button>
            </header>
            <slot name="body"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>