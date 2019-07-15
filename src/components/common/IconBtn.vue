<template>
    <v-btn icon :to="to" @click="$emit('click')">
        <v-icon>
            {{iconName}}
        </v-icon>
    </v-btn>
</template>

<script>
export default {
  props: ['iconName', 'to']
}
</script>
