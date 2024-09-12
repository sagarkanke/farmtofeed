
const state = {
    selectedItem: null,
    // other customer-related state properties
};

const mutations = {
    setSelectedItem(state, item) {
        state.selectedItem = item;
    },
    // other mutations related to customers
};

const actions = {
    // customer-related actions if any
};

const getters = {
    getSelectedItem: (state) => state.selectedItem,
    // other customer-related getters
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
