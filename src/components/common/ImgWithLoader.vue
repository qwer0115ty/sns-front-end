<template>
    <v-img v-if="src != null" :src="src" @click="$emit('click')">
        <template v-slot:placeholder>
            <v-layout
                fill-height
                align-center
                justify-center
                ma-0
            >
            <v-progress-circular indeterminate color="grey"></v-progress-circular>
            </v-layout>
        </template>
    </v-img>
</template>

<script>
export default {
  props: ['src']
}
</script>
