
import { Item } from '@/types/Item';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const ItemCard = ({ item, onClick }: ItemCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={item.coverImage} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {item.type}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
};

export default ItemCard;
