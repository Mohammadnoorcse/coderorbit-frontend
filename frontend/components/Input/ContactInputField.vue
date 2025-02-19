<script setup>

const props = defineProps({
    inputType: {
        type: String,
        default: "text",
    },
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: "",
    },
    placeholder: {
        type: String,
        default: "",
    },
    value: {
        type: String,
        default: "",
    },
    modelValue: {
        type: [String, Number],
        default: "",
    },
    dynamicClass: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(["update:modelValue"]);
</script>
<template>
    <div>
        <label :for="id" class="text-sm font-medium text-gray-700">
            {{ label }}
        </label>
        <input class="bg-light px-3 py-1 w-full rounded focus:outline-none border" :type="inputType" :id="id"
            :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :class="dynamicClass" />
    </div>
</template>
