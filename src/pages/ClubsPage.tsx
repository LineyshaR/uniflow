import React, { useState } from 'react';
import { Users, Calendar } from 'lucide-react';
import { CLUBS_DATA } from '../data/mockData';
import { StudentClub } from '../types';

export const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<StudentClub[]>(CLUBS_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Technical', 'Arts & Music', 'Literary'];

  const filteredClubs = clubs.filter(
    (c) => activeCategory === 'All' || c.category === activeCategory
  );

  const toggleJoin = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id === clubId) {
          const joined = !c.isJoined;
          return {
            ...c,
            isJoined: joined,
            membersCount: joined ? c.membersCount + 1 : c.membersCount - 1
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] text-xs font-semibold font-mono border border-[#047857]/20">
              STUDENT CHAPTERS & SOCIETIES
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">• 24 Registered Clubs</span>
          </div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            Clubs & Student Societies
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            Join special interest groups, attend weekly jams, and build campus projects
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#0B1B14] rounded-full border border-[#047857]/20 shadow-2xs self-start sm:self-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === c
                  ? 'bg-[#047857] text-white shadow-2xs'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs hover:border-[#047857] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with avatar & category */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={club.avatar}
                    alt={club.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-black/[0.04]"
                  />
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]">
                      {club.category}
                    </span>
                    <h3 className="font-apple text-base font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1">
                      {club.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => toggleJoin(club.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    club.isJoined
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-[#047857] hover:bg-[#065F46] text-white shadow-2xs'
                  }`}
                >
                  {club.isJoined ? 'Joined ✓' : '+ Join Club'}
                </button>
              </div>

              <p className="text-xs font-semibold text-[#047857] dark:text-[#34D399] mt-2">
                "{club.tagline}"
              </p>

              <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1 leading-relaxed">
                {club.description}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-3">
                {club.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-[#F6F8F6] dark:bg-[#0E281E] text-[10px] font-medium text-[#526059] dark:text-[#94A3B8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Next Meeting info */}
              <div className="mt-4 p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] flex items-center justify-between text-xs">
                <span className="text-[#526059] dark:text-[#94A3B8] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> Next Meet:
                </span>
                <span className="font-semibold text-[#141B18] dark:text-[#F3F7F5]">
                  {club.nextMeeting}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-[#526059] dark:text-[#94A3B8]">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> {club.membersCount} Active Members
              </span>
              <span>Lead: <strong className="text-[#141B18] dark:text-[#F3F7F5]">{club.leadName}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
