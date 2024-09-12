<template>
    <label :for="for" class="label">
      {{ text }}
      <span v-if="required" class="required-asterisk">*</span>
    </label>
  </template>
  
  <script>
  export default {
    name: 'LabelWithAsterisk',
    props: {
      text: {
        type: String,
        required: true
      },
      for: {
        type: String,
        required: true
      },
      required: {
        type: Boolean,
        default: false
      }
    }
  };
  </script>
  
  <style>
  .label {
    display: flex;
    align-items: center;
  }
  .required-asterisk {
    color: red;
    font-size: 1rem;
    /* margin-left: 0.15rem; */
  }
  </style>
  