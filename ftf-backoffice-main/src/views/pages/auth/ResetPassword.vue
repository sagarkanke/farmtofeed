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
import { AuthService } from '@/service/AuthService';
const authService = new AuthService(); 
const logoUrl = computed(() => {
     return `/demo/images/${layoutConfig.darkTheme.value ? 'login-logo' : 'login-logo'}.svg`;
    // return `/demo/images/logo.png`;
});


const resetPassword = async () => {
  try {
    await authService.resetPassword({ email: email.value });
    toast.add({ severity: 'success', summary: 'Success', detail: 'Password reset instructions sent to your email.', life: 3000 });
    router.push('/login'); // Navigate to login page or any other page
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.', life: 3000 });
  }
};
 

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div class="w-9 ">
                <div class="surface-card py-8 px-4 sm:px-4">
                    <div class="text-left mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Enter New Password</div>
                        <span class="text-600 font-medium">Create a strong password to keep your account secure</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">New Password</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full mb-5" style="padding: 1rem" v-model="email" />

                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Confirm Password</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full mb-5" style="padding: 1rem" v-model="email" />

                        <Toast/>
                        <Button label="Reset Password" class="w-full text-xl border-round-xl h-3rem"  :style="{'background-color':'#1E4A35'}" @click="resetPassword()"></Button>
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
