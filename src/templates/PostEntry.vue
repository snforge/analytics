<template>
    <Layout>
        <br />
        <g-link to="/" class="link">&larr; Go Back</g-link>
        <div class="post-title">
            <h1>{{$context.title}}</h1>
            <p class="post-date">{{ $context.created}}</p>
        </div>
        <div class="post-content">
            <p v-html="$context.description" />
        </div>
    </Layout>
</template>
