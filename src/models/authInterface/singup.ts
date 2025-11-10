export interface ISingUpPayload {
  user_name: string;
  email: string;
  password: string;
}
// Mock data
export const mockPosts = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    image:
      "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjUyOXwwfDF8c2VhY2h8MXx8c3Vuc2V0fGVufDB8fHx8fDE2NzA2MzI2NzA&ixlib=rb-1.2.1&q=80&w=1080",
    caption:
      "Enjoying the sunset at the beach! 🌅 #nature #travel #sunsetvibes",
    likes: 150,
    comments: 25,
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    image: "https://picsum.photos/600/600?random=1",
    caption: "Coffee time with a good book! ☕📚 #morningvibes #coffeeaddict",
    likes: 120,
    comments: 18,
  },
  {
    id: 3,
    user: {
      name: "Emily Clark",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    image: "https://picsum.photos/600/600?random=2",
    caption:
      "Hiking through the mountains! 🏞️ #adventure #outdoors #mountainlife",
    likes: 220,
    comments: 32,
  },
];
