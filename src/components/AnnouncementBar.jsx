import React from 'react';

const announcements = [
  "FREE DELIVERY on orders above ₦50,000 🚀",
  "New Drop: Self Starter Cap Collection — Shop Now",
  "BUILT, NOT GIVEN. — The SMYT Movement",
  "FREE DELIVERY on orders above ₦50,000 🚀",
  "New Drop: Self Starter Cap Collection — Shop Now",
  "BUILT, NOT GIVEN. — The SMYT Movement",
];

export default function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background overflow-hidden py-2">
      <div className="animate-slide-left flex whitespace-nowrap">
        {announcements.map((text, i) => (
          <span key={i} className="text-xs tracking-widest uppercase mx-12 font-light">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}