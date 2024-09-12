<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
const { layoutConfig } = useLayout();
const toast = useToast();
const router = useRouter();
const email = ref('');
const password = ref('');
const checked = ref(false);
import { useStore } from 'vuex';
const store = useStore();
const logoUrl = computed(() => {
    return `/demo/images/${layoutConfig.darkTheme.value ? 'login-logo' : 'login-logo'}.svg`;
    // return `/demo/images/logo.png`;
});


const login = async () => {
    const credentials = {
        email: email.value,
        password: password.value
    };
    const success = await store.dispatch('login', credentials);
    if (success) {
        router.push('/');
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Login Failed..!!', life: 1000 });
    }
};


</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div>
                <div class="w-full surface-card py-8 px-5 sm:px-8">
                    <div class="text-left mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Login</div>
                        <span class="text-600 font-medium">Enter your email below to login to your account</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <router-link to="/auth/forget-password"
                                class="font-medium no-underline ml-2 text-left cursor-pointer"
                                :style="{ color: '#747C50' }">
                                Forgot password?
                            </router-link>
                        </div>
                        <Toast />
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="login()"
                            :style="{ 'background-color': '#1E4A35', border: '#1E4A35' }"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
