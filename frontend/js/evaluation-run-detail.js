document.addEventListener('DOMContentLoaded', () => {
    const chatPanel = document.getElementById('chat-panel');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const toggleChatBtn = document.getElementById('toggle-chat-btn');

    if (closeChatBtn && chatPanel) {
        closeChatBtn.addEventListener('click', () => {
            chatPanel.classList.add('hidden');
        });
    }

    if (toggleChatBtn && chatPanel) {
        toggleChatBtn.addEventListener('click', () => {
            chatPanel.classList.toggle('hidden');
        });
    }
});
