import { useState } from "react";
import type { MyItemDetail } from "@/features/alquran/types/quran.types";
import { StartIntervalModal } from "@/features/alquran/components/StartIntervalModal";
import { ItemDetailActionSection } from "@/features/alquran/components/item-detail/ItemDetailActionSection";
import { ItemDetailHero } from "@/features/alquran/components/item-detail/ItemDetailHero";
import { ItemDetailStatsGrid } from "@/features/alquran/components/item-detail/ItemDetailStatsGrid";
import {
  getActionConfig,
  getInitialPhase,
  getStatusDisplayByPhase,
  getStatusStyleByPhase,
  parseContentRef,
  type ActionPhase,
} from "@/features/alquran/components/item-detail/itemDetailView.config";

export type { ActionPhase };

interface ItemDetailViewProps {
  item: MyItemDetail;
  juzIndex: number;
  backToJuzDetail: () => void;
  currentPhase?: ActionPhase;
  onPhaseChange: (phase: ActionPhase) => void;
}

export const ItemDetailView = ({
  item,
  juzIndex,
  backToJuzDetail,
  currentPhase,
  onPhaseChange,
}: ItemDetailViewProps) => {
  const phase = currentPhase ?? getInitialPhase(item.status);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const info = parseContentRef(item.content_ref);
  const statusStyle = getStatusStyleByPhase(phase);
  const statusDisplay = getStatusDisplayByPhase(phase);
  const config = getActionConfig(phase);

  const createdDate = new Date(item.created_at).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const transitionTo = (newPhase: ActionPhase) => {
    onPhaseChange(newPhase);
  };

  const handleActionClick = () => {
    switch (phase) {
      case "menghafal":
        transitionTo("interval_start");
        break;
      case "interval_start":
        setIsModalOpen(true);
        break;
      case "interval_end":
        if (config.href) {
          window.location.href = config.href;
        } else {
          console.log("Review dimulai untuk item:", item.item_id);
        }
        break;
    }
  };

  const handleIntervalSuccess = () => {
    transitionTo("interval_end");
  };

  return (
    <div className="animate-fadeIn pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <ItemDetailHero
        juzIndex={juzIndex}
        info={info}
        statusStyle={statusStyle}
        onBack={backToJuzDetail}
      />

      <ItemDetailStatsGrid
        reviewCount={item.review_count}
        createdDate={createdDate}
        info={info}
      />

      <ItemDetailActionSection
        phase={phase}
        config={config}
        statusDisplay={statusDisplay}
        onPrimaryAction={handleActionClick}
        onSecondaryAction={handleActionClick}
      />

      <StartIntervalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemId={item.item_id}
        itemTitle={`${info.title} – ${info.subtitle}`}
        onSuccess={handleIntervalSuccess}
      />
    </div>
  );
};
