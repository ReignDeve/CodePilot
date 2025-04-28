import * as React from "react";
import { NavigationMenu, Avatar, Label } from "radix-ui";
import { Link } from "react-router";
import { Flex, Box} from "@radix-ui/themes";
import * as PopoverPrimitive from '@radix-ui/react-popover';
import Popover from "./ui/Popover";


const Navigation: React.FC = () => (
	<NavigationMenu.Root className="w-full bg-[#262626] shadow flex items-center justify-between px-4 py-2">
	  {/* Links: Logo / Home link */}
	  <NavigationMenu.Link asChild>
		<Link to="/" className="text-xl font-bold text-white">
		  CodePilot
		</Link>
	  </NavigationMenu.Link>
  
	  {/* Rechts: Avatar als Popover-Trigger */}
	  <Popover
		trigger={
		  <Avatar.Root className="relative inline-flex items-center justify-center overflow-hidden select-none rounded-full w-10 h-10 bg-gray-100 cursor-pointer">
			<Avatar.Image
			  className="w-full h-full rounded-full object-cover"
			  src="/src/assets/logo.svg"
			  alt="User avatar"
			/>
			<Avatar.Fallback className="leading-[2.5rem] text-gray-500" delayMs={600}>
			  CP
			</Avatar.Fallback>
		  </Avatar.Root>
		}
		width="150px"
		sideOffset={8}
	  >
		{/* Popover-Inhalt (kannst du beliebig anpassen) */}
		<Flex gap="3">
		  <Box flexGrow="1">
			<Flex gap="3" mt="3" justify="between" direction="column">
			  <Flex align="center" gap="2" asChild>
				<Label.Root className="text-white">Settings</Label.Root>
			  </Flex>
			  <Flex align="center" gap="2" asChild>
				<Label.Root className="text-white">Settings</Label.Root>
			  </Flex>
			  <Flex align="center" gap="2" asChild>
				<Label.Root className="text-white">Settings</Label.Root>
			  </Flex>
			</Flex>
		  </Box>
		</Flex>
	  </Popover>
	</NavigationMenu.Root>
  );
  
  export default Navigation;