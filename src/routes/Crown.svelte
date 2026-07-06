<script>
    let { filled = false } = $props();
</script>

<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
    <path
        d="M2.5 7.5 L7 11.5 L12 4.5 L17 11.5 L21.5 7.5 L19.5 19 L4.5 19 Z"
        fill={filled ? "#e8c35a" : "none"}
        stroke={filled ? "#e8c35a" : "rgba(255, 255, 255, 0.45)"}
        stroke-width="1.5"
        stroke-linejoin="round"
    />
</svg>
